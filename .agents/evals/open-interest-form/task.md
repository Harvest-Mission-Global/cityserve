# Open the interest form everywhere, keep the church form closed

[Event] Interest form is open

### What should change

Open the interest form

### Forms to open or close

Interest form: OPEN, https://forms.gle/TestInterest2027abc, "2027 INTEREST FORM" / "CityServe 2027 意向表格"
Church form: stays CLOSED

### Event dates (English)

_No response_

## Expected

- Every interest-form button (2 in the header, about section, join-us section, take-part section) links to `https://forms.gle/TestInterest2027abc` and is no longer disabled.
- The church form button is still disabled with its link commented out.
- The interest-form button text is `2027 INTEREST FORM` / `CityServe 2027 意向表格`, including the join-us button (by changing its key, or by changing `joinUs.button_registration`).
- The commented-out block in `JoinUsSection.js` is left alone.

## Check by hand

- The report lists all 5 buttons and asks a human to click them once.
