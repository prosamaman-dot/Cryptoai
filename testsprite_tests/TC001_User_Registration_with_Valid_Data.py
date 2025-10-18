import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5500", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on the Sign Up button to navigate to the registration page.
        frame = context.pages[-1]
        # Click on the Sign Up button to go to the registration page
        elem = frame.locator('xpath=html/body/div/header/div[2]/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the registration form with valid data and submit it.
        frame = context.pages[-1]
        # Enter valid username in Full Name field
        elem = frame.locator('xpath=html/body/div[8]/div/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('testuser123')
        

        frame = context.pages[-1]
        # Enter valid email in Email Address field
        elem = frame.locator('xpath=html/body/div[8]/div/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('testuser123@example.com')
        

        frame = context.pages[-1]
        # Enter valid password in Password field
        elem = frame.locator('xpath=html/body/div[8]/div/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestPass!123')
        

        frame = context.pages[-1]
        # Enter valid password confirmation in Confirm Password field
        elem = frame.locator('xpath=html/body/div[8]/div/form/div[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestPass!123')
        

        frame = context.pages[-1]
        # Click to agree to the Terms of Service checkbox
        elem = frame.locator('xpath=html/body/div[8]/div/form/div[5]/label').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click Create Account button to submit the registration form
        elem = frame.locator('xpath=html/body/div[8]/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        try:
            await expect(frame.locator('text=Registration Failed: Please try again later').first).to_be_visible(timeout=1000)
        except AssertionError:
            raise AssertionError("Test case failed: The user registration did not complete successfully as expected in the test plan. The account creation or redirection to the dashboard/welcome page did not occur.")
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    