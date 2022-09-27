import React, { useState } from 'react'
import moment from 'moment'
//import 'bootstrap/dist/css/bootstrap.min.css'

export default function DateTimePicker({ value, onChange }) {
  const [_currentValue, _setCurrentValue] = useState(null);
  const [_value, _setValue] = useState("");

  if (_currentValue !== value) {
    _setCurrentValue(value)
    if (value != null && value != "") {
      _setValue(moment(value).local().format(moment.HTML5_FMT.DATETIME_LOCAL))
    }
  }

  return (
<input type="datetime-local" value={_value}
              onChange={(e) => {
                _setValue(e.target.value)

                const currentValue = moment(e.target.value)
                if (currentValue.isValid() && onChange != null) {
                  onChange(currentValue.utc().toISOString())
                }
              }}
              id="time_selector"
              placeholder="Select Time" />
  )
}
