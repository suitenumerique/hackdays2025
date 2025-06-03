# 🏆 Final Submission for Matrix Preview

## Project
Secure url previews on Matrix

## Project Description
Currently, Matrix clients send URLs in plaintext to the server to generate link previews. This practice violates the principle of end-to-end encryption, as it exposes potentially sensitive data to the server.

Our project aims to restore full end-to-end encryption integrity by implementing client-side URL preview generation in the secure messaging app Element X for Android. By performing URL fetching and metadata extraction directly on the user's device, we eliminate the need to transmit URLs to the server, ensuring that no private link data ever leaves the encrypted context.

This enhancement preserves a seamless user experience with link previews, while reinforcing user privacy and upholding Matrix’s core commitment to secure communication.


## Contributors
<a href="https://github.com/matmaul">@matmaul</a>, <a href="https://github.com/jonathanperret">@jonathanperret</a>, <a href="https://github.com/gdarquie">@gdarquie</a>, <a href="https://github.com/ranass">@ranass, <a href="https://github.com/yostyle">@yostyle</a>

## Code base
https://github.com/ranass/element-x-android
https://github.com/ranass/matrix-rust-sdk

## Deliverables 
(Provide a link to a live demo, if you have one)
(Add screenshots (image, gif or video) and presentation deck to `/assets`)

## Key Achievements
Securely display URL previews within messages in Element X, the Matrix client for Android.


## Challenges Overcome
Our team faced several technical challenges during this project:

- Learning Rust: Since part of the Element X stack and the Matrix Rust SDK are written in Rust, we had to quickly ramp up our understanding of the language, its ownership model, and async patterns.

- Understanding the Matrix Protocol: Gaining a deep understanding of how Matrix handles encrypted messages, link previews, and client-server interactions was crucial to ensure our approach aligned with its end-to-end encryption principles.

- Working with the Matrix Rust SDK: Integrating with the SDK required us to understand its structure, APIs, and how it handles encrypted events, media fetching, and client-side rendering.

- Navigating the Element X Android Architecture: Element X Android is built with a modern but complex architecture (Jetpack Compose, Rust bindings, reactive UI patterns). Getting up to speed and finding the right extension points to integrate our client-side preview logic was a significant challenge.

- Learning Kotlin: Since the Element X project builds the app in Kotlin for Android and Swift for iOS, we use both versions depending on the team member's focus, but have chosen to concentrate on the Android version.

## Impact
Our solution significantly improves user privacy for the hundreds of thousands of Element X users by enabling secure, end-to-end encrypted link previews. Until now, URLs had to be sent in plaintext to the server for preview generation, creating a privacy gap in an otherwise secure messaging system.

By moving URL preview generation entirely to the client side, our approach ensures that link content stays fully encrypted and private. This reinforces Matrix’s core values of decentralization and privacy, while maintaining a seamless and rich user experience.

Once integrated, this feature will bring stronger privacy guarantees to a wide user base without compromising usability—setting a new standard for secure messaging platforms.

## Next Steps
Bridge the SDK and the mobile app to collect data needed to generate the preview.

