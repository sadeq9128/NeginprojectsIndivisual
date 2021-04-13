import { DatePicker as DatePickerJalali } from "antd-jalali";
import { ConfigProvider } from "antd";
import React from 'react';
import 'moment/locale/fa';
import locale from 'antd/es/date-picker/locale/fa_IR';
import classDate from "./DatePick.module.css";

const DatePick = (props) => {

  return (
    <ConfigProvider locale={locale}  direction="rtl">
      <DatePickerJalali disabled={props.disabled} onChange={(value) => props.onChange(value)} className={classDate.div}
          locale={locale}
        />
    </ConfigProvider>
  );

}
export default DatePick;
