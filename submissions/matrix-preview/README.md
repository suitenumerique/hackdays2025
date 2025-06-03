# 🏆 Final Submission for Matrix Preview

## Project
Secure url previews on Matrix

## Project Description
Currently, Matrix clients send URLs in plaintext to the server to generate link previews. This practice breaks the principle of end-to-end encryption, as it exposes potentially sensitive data to the server.

Our project aims to restore full end-to-end encryption integrity by implementing client-side URL preview generation in the secure messaging app Element X for Android. By performing URL fetching and metadata extraction directly on the user's device, we eliminate the need to transmit URLs to the server, ensuring that no private link data ever leaves the encrypted context.

This enhancement maintains a smooth user experience (with link previews) while reinforcing user privacy and Matrix's core commitment to secure communication.


## Contributors
<a href="https://github.com/matmaul">@matmaul</a>, <a href="https://github.com/jonathanperret">@jonathanperret</a>, <a href="https://github.com/gdarquie">@gdarquie</a>, <a href="https://github.com/ranas">@ranas, <a href="https://github.com/yostyle">@yostyle</a>

## Code base
https://github.com/ranass/element-x-android
https://github.com/ranass/matrix-rust-sdk

## Deliverables 
(Provide a link to a live demo, if you have one)
(Add screenshots (image, gif or video) and presentation deck to `/assets`)

## Key Achievements
Display the secure URL previews securely in Element X Android messages (Matrix client for Android).

## Challenges Overcome
improve skills on Rust, Matrix protocol, Element X.

## Impact
All Element X users (more than 100k) could display a preview before clicking on a URL.

## Next Steps
Bridge the SDK and the mobile app to collect data needed to generate the preview.

