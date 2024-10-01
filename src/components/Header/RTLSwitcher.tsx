import { useDirection } from "@/context/DirectionContext";

const RTLSwitcher = () => {
  const { direction, toggleDirection } = useDirection();

  return (
    <li>
      <label
        className={`relative m-0 block h-7.5 w-14 rounded-full ${
          direction === "ltr" ? "bg-primary" : "bg-stroke"
        }`}
      >
        <input
          type="checkbox"
          onChange={() => {
            toggleDirection();
          }}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            direction === "ltr" ? "!translate-x-full" : ""
          }`}
        >
          {/* RTL Icon */}
          <span
            className={`${direction === "rtl" ? "inline-block" : "hidden"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="16"
              height="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 5H5v14h9v-2H7v-2h5v-2H7v-2h7v-2H7V7h7V5Zm5 12-4 4v-3h-4v-2h4v-3l4 4Z"
                fill="#969AA1"
              />
            </svg>
          </span>
          {/* LTR Icon */}
          <span
            className={`${direction === "ltr" ? "inline-block" : "hidden"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="16"
              height="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 5h9v14h-9v-2h7v-2h-5v-2h5v-2h-7v-2h7V7h-7V5Zm-5 12 4 4v-3h4v-2H9v-3l-4 4Z"
                fill="#969AA1"
              />
            </svg>
          </span>
        </span>
      </label>
    </li>
  );
};

export default RTLSwitcher;
