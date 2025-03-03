# UML Diagrams

This folder contains UML diagrams used for documenting and visualizing various processes in the project. Each diagram includes its source code and a rendered image.

## Folder Structure

```
docs/
└── uml/
    ├── google_oauth_signin_sequence_diagram.puml  # Raw PlantUML code
    ├── google_oauth_signin_sequence_diagram.png   # Rendered image
    └── README.md
```

### File Descriptions

- **`google_oauth_signin_sequence_diagram.puml`**  
  This file contains the PlantUML source code for the "Sign in with Google" sequence diagram. It describes the interaction flow between the user, frontend, backend, and Google OAuth.

- **`google_oauth_signin_sequence_diagram.png`**  
  This is the rendered image of the sequence diagram, generated from the `.puml` file.

## How to Edit and Render Diagrams

1. **Edit**  
   Open the `.puml` file in any text editor or IDE that supports PlantUML (e.g., VS Code with a PlantUML extension).

2. **Render**  
   Use a PlantUML tool to generate a visual representation of the diagram:

   - **Online:** Copy and paste the code into [PlantText](https://www.planttext.com/) or [PlantUML Online Editor](https://plantuml.com/plantuml).
   - **Locally:** Install PlantUML and use the following command:
     ```bash
     plantuml google_oauth_signin_sequence_diagram.puml
     ```
     This will generate a `.png` image in the same directory.

3. **Save Output**  
   Save the rendered output as a `.png` or `.svg` file in this folder.

## Naming Conventions

- Use descriptive names for both raw and rendered files.
- Example: `__diagram.`  
  E.g., `google_oauth_signin_sequence_diagram.puml`

## Notes

- Keep raw files (`.puml`) and rendered images (`.png`) together for easier reference.
- If adding more diagrams in the future, consider organizing them into subfolders based on features or functionality (e.g., `auth/`, `user-management/`, etc.).
