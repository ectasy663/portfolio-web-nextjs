I have set up a testing framework with Jest and React Testing Library, and integrated accessibility testing with `@axe-core/react`.

Here is a summary of the changes and how you can use them to improve your portfolio to a 10/10:

### 1. Testing

I have installed the necessary dependencies and configured Jest to work with your Next.js project. I also added two example tests:

*   `src/__tests__/ResumeButton.test.tsx`: A simple test for your `ResumeButton` component.
*   `src/__tests__/Hero.test.tsx`: A more complex test for your `Hero` component, which includes mocking a library.

**To run the tests:**

1.  First, you need to install the new dependencies. Open your terminal and run:
    ```bash
    npm install
    ```
2.  Then, run the tests with:
    ```bash
    npm test
    ```

You can now add more tests for your other components to ensure they are working as expected.

### 2. Accessibility

I have integrated `@axe-core/react` into your project. It will automatically run in your development environment and log any accessibility issues to your browser's console.

**To see the accessibility report:**

1.  Run your development server with `npm run dev`.
2.  Open your browser's developer tools and check the console for any logs prefixed with `[axe]`.

I have also improved the accessibility of the social media icons in your `Hero` component by adding the `aria-label` attribute. You should apply similar improvements to other interactive elements in your portfolio.

By writing comprehensive tests and addressing all accessibility issues, you can elevate your portfolio to a perfect 10/10.