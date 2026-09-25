# Reillo Personal Website

A personal website for Reillo, built with plain HTML, CSS, and JavaScript.

## Features

- Personal profile and introduction
- Photos page
- Technology stack showcase
- Recent itinerary table
- Weekly timetable
- Automatic current-course highlighting based on weekday and time
- Holiday and consecutive-rest-day timetable handling
- Changelog page with update history
- Responsive layout for desktop and mobile devices
- Liquid Glass inspired navigation bar

## Project Structure

- `index.html` - Main homepage
- `css/index.css` - Homepage styles
- `photos.html` - Photos page
- `css/photos.css` - Photos page styles
- `changelog.html` - Website changelog
- `css/changelog.css` - Changelog styles
- `js/course-current.js` - Current-course and holiday timetable logic
- `js/fadeUpAnimation.js` - Page entrance animations
- `js/collapsible-container.js` - Expandable content interactions
- `js/loader-container.js` - Loading screen behavior
- `assets/` - Images, favicons, and background assets

## Run Locally

No build tools are required. Open `index.html` directly in a browser, or serve the directory with a local web server:

```powershell
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deploy with GitHub Pages

1. Open the repository settings on GitHub.
2. Select **Pages**.
3. Choose the `main` branch and the `/ (root)` folder.
4. Save the configuration.

The site will be available at the generated GitHub Pages URL after deployment finishes.

## Author

Reillo
