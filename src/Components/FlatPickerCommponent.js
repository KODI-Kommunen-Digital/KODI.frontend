import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from "date-fns";

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

    if (!date || date.length === 0) return;

    const formattedDate = format(date[0], "yyyy-MM-dd'T'HH:mm");

    // Auto-fill end date if this is startDate
    if (name === "startDate") {
      const startDateTime = new Date(formattedDate);
      const autoEndDateTime = new Date(startDateTime);
      // Add 1 hour to start time as default
      autoEndDateTime.setHours(startDateTime.getHours() + 1);
      const autoEndDate = format(autoEndDateTime, "yyyy-MM-dd'T'HH:mm");

      setListingInput((prev) => ({
        ...prev,
        [name]: formattedDate,
        // Auto-fill end date only if it's empty
        endDate: !prev.endDate ? autoEndDate : prev.endDate,
      }));
    } else {
      setListingInput((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    }

    // Clear error when user is selecting a date
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClose = (selectedDates, dateStr, instance) => {
    // If custom onClose is provided, use it
    if (customOnClose) {
      customOnClose(selectedDates, dateStr, instance);
      return;
    }

    // Validate only after date picker closes
    if (dateStr && validateInput) {
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-600">
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
          ...(effectiveMinDate && { minDate: effectiveMinDate }),
          ...(effectiveMaxDate && { maxDate: effectiveMaxDate }),
          onClose: handleClose,
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
  minDate: new Date(),
  maxDate: null,
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  validateInput: null,
  customOnChange: null,
  customOnClose: null,
  additionalOptions: {},
};

export default FlatPickerCommponent;
