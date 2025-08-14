
This project is a simple registration built with **Vue 3**, **Pinia** for state management, and **VeeValidate** for form validation. It demonstrates boats management features such as listing boats, adding, editing, and deleting. Also authentication.

## Features

- Vue 3
- Pinia state management
- VeeValidate + Yup for form validation
- Boat CRUD: list, add, edit, delete
- Authentication (login, register, logout)

## Project Structure

```
src/
  assets/           # CSS and static assets
  components/       # Reusable components (e.g., Navbar)
  router/           # Vue Router configuration
  stores/           # Pinia stores
  views/            # Page components (Login, Register, Boats, etc.)
```

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mbouzas/owt-challenge-fronted.git
cd owt-challenge-fronted
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```


## (Other option) Run with Docker

### Prerequisites:

    Docker installed and running


### Build the Docker image

From the project root directory run:

```bash
docker build -t owt-challenge-frontend .
```
### Run the Docker container

```bash
docker run -d -p 3000:80 owt-challenge-frontend
```
-p 3000:80 maps port 3000 on your host to port 80 in the container (Nginx default). Be sure 3000 is not already in use on your host.

http://localhost:3000/

## Usage

- **Home page**: Displays the  Boat list. The user clicks on a boat item and gets a detail view over it.
- **Add/Edit**: Click "Add" or "Edit" a boat to open the form.
- **Delete**: Click the delete button to remove a boat.
- **Login/Register**: Use the authentication forms to log in and manage Boats Console.

## Customization

- Update the UI in `src/views/boats/List.vue` and `src/views/boats/AddEdit.vue`.
- Modify routes in `src/router/index.js` and `src/router/boats.routes.js`.
- Adjust state logic in `src/stores/`.
# owt-challenge-vue
