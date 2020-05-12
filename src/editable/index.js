import React, { useState, useRef } from 'react';

export default function Editable({ value, onUpdate }) {
  const [live, setLive] = useState(false);
  const [svalue, setsValue] = useState(value);
  const input = useRef(null);

  function onChange(e) {
    setsValue(e.target.value);
  }

  function onBlur(e) {
    setLive(false);
    onUpdate && onUpdate(svalue);
  }

  return <div className="eidtable">
    {
      live ?
        (<input type="text" value={svalue} onBlur={onBlur} ref={input} onChange={onChange}/>) :
        (<div onDoubleClick={() => setLive(true)}>{svalue}</div>)
    }
  </div>
}