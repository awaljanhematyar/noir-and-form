/** Accessible local-only forms share validation, linked errors, and input retention. */
import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { provinces, validateForm } from '../utils/shop';

// ========================================
// FORM FIELD CONTRACTS
// ========================================
const checkoutFields = [
  ['firstName', 'First name', 'given-name', 80],
  ['lastName', 'Last name', 'family-name', 80],
  ['email', 'Email address', 'email', 254],
  ['street', 'Street address', 'address-line1', 120],
  ['unit', 'Apartment / unit (optional)', 'address-line2', 40],
  ['city', 'City', 'address-level2', 80],
  ['province', 'Province / territory', 'address-level1'],
  ['postal', 'Postal code', 'postal-code', 7],
];
const contactFields = [
  ['name', 'Your name', 'name', 80],
  ['email', 'Email address', 'email', 254],
  ['subject', 'Subject', 'off', 120],
  ['message', 'Your message', 'off', 2000],
];

export default function DemoForm({ checkout = false, onValid, disabled = false }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submitting = useRef(false);
  const fields = checkout ? checkoutFields : contactFields;

  // ========================================
  // VALIDATION AND DUPLICATE-SUBMIT PROTECTION
  // ========================================
  function submit(event) {
    event.preventDefault();
    if (submitting.current || disabled) return;
    const nextErrors = validateForm(values, checkout);
    setErrors(nextErrors);
    setSubmitted(true);
    if (Object.keys(nextErrors).length) {
      document.getElementById(`form-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    submitting.current = true;
    setBusy(true);
    // Deliberately no network request and no durable personal-data write.
    if (checkout) onValid();
    else {
      setDone(true);
      setValues({});
    }
    setBusy(false);
  }
  function change(key, value) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted) setErrors(validateForm(next, checkout));
  }
  if (done)
    return (
      <div className="form-success" role="status">
        <p className="eyebrow">A MOMENT OF CONNECTION</p>
        <h2>Thank you for exploring.</h2>
        <p>Demo only — your message has not been sent. No personal information has been saved.</p>
        <button
          className="button-outline"
          onClick={() => {
            setDone(false);
            setSubmitted(false);
            submitting.current = false;
          }}
        >
          Try the form again
        </button>
      </div>
    );
  return (
    <form className={`demo-form ${checkout ? 'checkout-form' : ''}`} noValidate onSubmit={submit}>
      {Object.keys(errors).length > 0 && (
        <div className="error-summary" role="alert">
          <p>Please review the following fields:</p>
          <ul>
            {Object.keys(errors).map((key) => (
              <li key={key}>
                <a href={`#form-${key}`}>
                  {fields.find((field) => field[0] === key)?.[1]}: {errors[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="form-fields">
        {fields.map(([key, label, autoComplete, maxLength]) => (
          <div key={key} className={`form-field field-${key}`}>
            <label htmlFor={`form-${key}`}>{label}</label>
            {key === 'province' ? (
              <select
                id={`form-${key}`}
                autoComplete={autoComplete}
                value={values[key] || ''}
                required
                aria-invalid={Boolean(errors[key])}
                aria-describedby={errors[key] ? `error-${key}` : undefined}
                onChange={(event) => change(key, event.target.value)}
              >
                <option value="">Select province or territory</option>
                {provinces.map((province) => (
                  <option key={province}>{province}</option>
                ))}
              </select>
            ) : key === 'message' ? (
              <textarea
                id={`form-${key}`}
                rows={5}
                minLength={10}
                maxLength={maxLength}
                value={values[key] || ''}
                required
                aria-invalid={Boolean(errors[key])}
                aria-describedby={errors[key] ? `error-${key}` : undefined}
                onChange={(event) => change(key, event.target.value)}
              />
            ) : (
              <input
                id={`form-${key}`}
                type={key === 'email' ? 'email' : 'text'}
                autoComplete={autoComplete}
                maxLength={maxLength}
                value={values[key] || ''}
                required={key !== 'unit'}
                aria-invalid={Boolean(errors[key])}
                aria-describedby={errors[key] ? `error-${key}` : undefined}
                onChange={(event) => change(key, event.target.value)}
                onBlur={() => {
                  if (key === 'postal')
                    change(
                      key,
                      (values[key] || '')
                        .toUpperCase()
                        .replace(/\s/g, '')
                        .replace(/^(.{3})(.+)$/, '$1 $2'),
                    );
                }}
              />
            )}
            {errors[key] && (
              <p className="field-error" id={`error-${key}`}>
                {errors[key]}
              </p>
            )}
          </div>
        ))}
      </div>
      {checkout && (
        <p className="country-fixed">
          <strong>Country:</strong> Canada · Demo destination only
        </p>
      )}
      <p className="demo-notice">
        {checkout
          ? 'Demo order — no payment or fulfillment. Use fictional details. Never enter payment-card information.'
          : 'Demo form — your message will not be sent. Please use fictional details.'}
      </p>
      <button className="button" type="submit" disabled={busy || disabled}>
        {busy ? 'A moment…' : checkout ? 'Place demo order' : 'Preview message submission'}
        <ArrowUpRight size={17} />
      </button>
    </form>
  );
}
