# Fix a planted mobile layout bug from a bug report

[Bug] Page moves sideways on my phone

### What is wrong

On my phone the page wiggles left and right when I scroll past the 2025 recap numbers. It did not do this before. On my computer it is fine.

### Where on the page

Recap

### Where it happens

- [x] Phone
- [x] English
- [x] 繁體中文

## Expected

- The agent runs `yarn screenshots`, sees "page scrolls sideways" on the recap cards at mobile width, and finds the card width in `ReCap.js`.
- The fix is small: the phone width of the recap cards goes back to fitting two cards side by side. No other file changes.
- `yarn screenshots` passes (no new problems).

## Check by hand

- The report names the cause (card width on phones) and says the desktop layout did not change.
