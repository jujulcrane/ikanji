I need to add a new "Vocab (coming-soon)" page to my IKanji Next.js/React app with user-specific access control and flashcard functionality.
Requirements:

1. Access Control:

Create a new page/route called "Vocab (coming-soon)"
This page should ONLY be fully accessible to the user with userId: V7ZOSGug90XpRG09dFPJX9nNZex2
For this authorized user: display the full functional page with all features
For all other users: display the page link/button as light gray and make it unclickable (disabled state)

2. Page Functionality (for authorized user):

Display a button titled "Quartet 1 vocab"
When the button is clicked, it should display vocabulary flashcards using my existing flashcard component
The flashcards should cycle through the vocab data from the JSON file (see below) 3. Data Structure:
Use the JSON data file at /data/quartet1-vocab.json 4. Implementation Guidelines:

IMPORTANT: Reuse my existing components wherever possible - especially the flashcard component that already exists in the codebase
First, examine the existing flashcard component to understand its props and structure
Examine the existing authentication/user context to understand how to check the current user's ID
Follow the existing routing patterns in the app for creating the new page
Use the existing styling patterns and design system
Make sure the navigation/menu properly shows the "Vocab (coming-soon)" option with the correct styling based on user authorization

5. Expected Behavior:

When the authorized user clicks "Quartet 1 vocab", the flashcards should display each vocab item showing the word, reading, and meaning (at minimum)
The flashcard component should handle navigation between cards (if it doesn't already have this built-in, adapt it appropriately)
For unauthorized users, the "Vocab (coming-soon)" link should appear grayed out (use opacity or disabled styles) and not be clickable

Please examine the codebase structure first, identify the existing flashcard component and auth patterns, then implement this feature following the established conventions in my IKanji app.
