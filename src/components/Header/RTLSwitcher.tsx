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
          <span className="dark:hidden">
            {/* New icon for light mode */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C11.4477 2 11 2.44772 11 3V5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5V3C13 2.44772 12.5523 2 12 2Z"
                fill="#969AA1"
              />
              <path
                d="M4.22183 4.22183C3.9087 4.53496 3.9087 5.06504 4.22183 5.37817C4.53496 5.6913 5.06504 5.6913 5.37817 5.37817L7.07107 3.68529C7.3842 3.37216 7.3842 2.84108 7.07107 2.52795C6.75794 2.21482 6.22686 2.21482 5.91373 2.52795L4.22183 4.22183Z"
                fill="#969AA1"
              />
              <path
                d="M2 12C2 11.4477 2.44772 11 3 11H5C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13H3C2.44772 13 2 12.5523 2 12Z"
                fill="#969AA1"
              />
              <path
                d="M18 12C18 11.4477 18.4477 11 19 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H19C18.4477 13 18 12.5523 18 12Z"
                fill="#969AA1"
              />
              <path
                d="M4.22183 19.7782C3.9087 19.465 3.9087 18.934 4.22183 18.6208C4.53496 18.3077 5.06504 18.3077 5.37817 18.6208L7.07107 20.3147C7.3842 20.6279 7.3842 21.158 7.07107 21.4711C6.75794 21.7842 6.22686 21.7842 5.91373 21.4711L4.22183 19.7782Z"
                fill="#969AA1"
              />
              <path
                d="M19.7782 4.22183C20.0913 4.53496 20.0913 5.06504 19.7782 5.37817C19.465 5.6913 18.934 5.6913 18.6208 5.37817L16.9289 3.68529C16.6158 3.37216 16.6158 2.84108 16.9289 2.52795C17.242 2.21482 17.7731 2.21482 18.0862 2.52795L19.7782 4.22183Z"
                fill="#969AA1"
              />
              <path
                d="M12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15C15 16.6569 13.6569 18 12 18Z"
                fill="#969AA1"
              />
            </svg>
          </span>
          <span className="hidden dark:inline-block">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.3533 10.62C14.2466 10.44 13.9466 10.16 13.1999 10.2933C12.7866 10.3667 12.3666 10.4 11.9466 10.38C10.3933 10.3133 8.98659 9.6 8.00659 8.5C7.13993 7.53333 6.60659 6.27333 6.59993 4.91333C6.59993 4.15333 6.74659 3.42 7.04659 2.72666C7.33993 2.05333 7.13326 1.7 6.98659 1.55333C6.83326 1.4 6.47326 1.18666 5.76659 1.48C3.03993 2.62666 1.35326 5.36 1.55326 8.28666C1.75326 11.04 3.68659 13.3933 6.24659 14.28C6.85993 14.4933 7.50659 14.62 8.17326 14.6467C8.27993 14.6533 8.38659 14.66 8.49326 14.66C10.7266 14.66 12.8199 13.6067 14.1399 11.8133C14.5866 11.1933 14.4666 10.8 14.3533 10.62Z"
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
