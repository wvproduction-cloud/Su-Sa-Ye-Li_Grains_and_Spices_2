Su-Sa-Ye-Li Multi-Page Website

Fixed Sinhala rendering:
- Sinhala UI text uses bundled Unicode-compatible Noto Serif Sinhala ExtraBold.
- English text uses Inter.
- The legacy Tharu fonts are not used for rendering because they can corrupt Unicode Sinhala in browsers.
- Sinhala/English language switch is preserved.
- Admin login protection is preserved.

Open index.html.

Web page image manager:
- Open admin.html after login.
- In “වෙබ් පිටුවේ පින්තූර වෙනස් කරන්න”, select the local assets/images folder.
- Choose an image for each slot, then click “වෙබ් පිටුවේ පින්තූර සුරකින්න”.
- Images are written as local files into the selected folder and their relative paths are stored in the browser catalog.


GitHub Image Upload (static-site workflow):
- In Admin → GitHub Image Settings, enter GitHub owner, repository, branch, image folder path (default assets/images), and a fine-grained token.
- Save GitHub Settings, then Test Connection.
- Add New Product: choose an image, then click “Upload Image to GitHub”. The image path is filled automatically.
- Web Page Images: choose an image in any slot, then click “Upload to GitHub” under that slot.
- Images are uploaded to the repository through the GitHub Contents API. The website then uses the repository-relative path.
- The GitHub token is kept only in sessionStorage for this browser session and is never embedded into the page source.
