import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from "date-fns";
import { German } from "flatpickr/dist/l10n/de";
import { English } from "flatpickr/dist/l10n/default";

/**
 * FlatPickerComponent - A reusable date/time picker component
 * Supports both startDate and endDate with auto-fill functionality
 *
 * Alternative calendar options you can swap in:
 * - react-datepicker: npm install react-datepicker
 * - react-day-picker: npm install react-day-picker
 * - @mui/x-date-pickers: npm install @mui/x-date-pickers
 */
const FlatPickerCommponent = ({
  id,
  name,
  t,
  listingInput,
  setListingInput,
  error,
  setError,
  validateInput,
  placeholder,
  required = true,
  minDate,
  maxDate,
  enableTime = true,
  dateFormat = "Y-m-d H:i",
  customOnChange,
  customOnClose,
  additionalOptions = {},
}) => {
  const value = listingInput[name];
  const errorMessage = error[name];
  const flatpickrRef = useRef(null);

  // Use null for minDate/maxDate if undefined to avoid restrictions when editing
  const effectiveMinDate = minDate === undefined ? null : minDate;
  const effectiveMaxDate = maxDate === undefined ? null : maxDate;

  // Update Flatpickr when value changes (e.g., from API)
  useEffect(() => {
    if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
      const fpInstance = flatpickrRef.current.flatpickr;
      if (value) {
        // Set the date in Flatpickr instance
        fpInstance.setDate(value, false); // false = don't trigger onChange
      } else {
        // Clear the date if value is empty
        fpInstance.clear();
      }
    }
  }, [value, name]);

  const handleChange = (date, dateStr, instance) => {
    // If custom onChange is provided, use it instead
    if (customOnChange) {
      customOnChange(date, dateStr, instance);
      return;
    }

    // Handle date clearing - update state to empty string
    if (!date || date.length === 0) {
      setListingInput((prev) => ({
        ...prev,
        [name]: "",
      }));

      // If field is required, validate to show error; otherwise clear error
      if (required && validateInput) {
        validateInput({
          target: {
            name,
            value: "",
          },
        });
      } else {
        setError((prev) => ({ ...prev, [name]: "" }));
      }
      return;
    }

    const formattedDate = format(date[0], "yyyy-MM-dd'T'HH:mm");

    // Set the selected date without auto-filling other fields
    setListingInput((prev) => ({
      ...prev,
      [name]: formattedDate,
    }));

    // Don't clear error here - let validation in handleClose handle it
  };

  const handleClose = (selectedDates, dateStr, instance) => {
    // If custom onClose is provided, use it
    if (customOnClose) {
      customOnClose(selectedDates, dateStr, instance);
      return;
    }

    // Only validate if a date was actually selected (dateStr is not empty)
    // This prevents:
    // 1. Showing "required" errors when user just opens/closes without selecting
    // 2. Triggering validation when user clears the date (already handled in handleChange)
    if (validateInput && dateStr) {
      validateInput({
        target: {
          name,
          value: dateStr.replace(" ", "T"),
        },
      });
    }
  };

  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-600"
        onClick={(e) => e.preventDefault()}
      >
        {placeholder} {required && "*"}
      </label>
      <Flatpickr
        ref={flatpickrRef}
        id={id}
        name={name}
        value={value}
        options={{
          enableTime,
          dateFormat,
          time_24hr: true, // eslint-disable-line camelcase
          clickOpens: true,
          allowInput: false,
          locale: process.env.REACT_APP_LANG === "de" ? German : English,
          ...(effectiveMinDate && { minDate: effectiveMinDate }),
          ...(effectiveMaxDate && { maxDate: effectiveMaxDate }),
          onClose: handleClose,
          // Custom parseDate to handle UTC strings without timezone conversion
          parseDate: (dateStr) => {
            if (!dateStr) return null;
            // If date ends with 'Z', treat it as the literal time (not UTC)
            // Example: "2026-01-01T13:00:00.000Z" -> show as 13:00 local time
            let d = dateStr;
            if (d.endsWith("Z")) {
              d = d.slice(0, -1);
            }
            // Remove milliseconds if present
            d = d.replace(/\.\d{3}/, "");
            return new Date(d);
          },
          ...additionalOptions,
        }}
        onChange={handleChange}
        className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
        placeholder={placeholder}
      />
      <div
        className="mt-2 text-sm text-red-600"
        style={{
          visibility: errorMessage ? "visible" : "hidden",
        }}
      >
        {errorMessage}
      </div>
    </>
  );
};

FlatPickerCommponent.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  t: PropTypes.func,
  listingInput: PropTypes.object.isRequired,
  setListingInput: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
  validateInput: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  minDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  maxDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  enableTime: PropTypes.bool,
  dateFormat: PropTypes.string,
  customOnChange: PropTypes.func,
  customOnClose: PropTypes.func,
  additionalOptions: PropTypes.object,
};

FlatPickerCommponent.defaultProps = {
  t: null,
  required: true,
  minDate: null,
  maxDate: null,
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  validateInput: null,
  customOnChange: null,
  customOnClose: null,
  additionalOptions: {},
};

export default FlatPickerCommponent;
