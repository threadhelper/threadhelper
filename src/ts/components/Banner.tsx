import { h } from 'preact';

interface BannerInput {
  text: string;
  redirect: string;
  onDismiss: () => void;
}
export const Banner = ({ text, redirect, onDismiss }: BannerInput) => {
  // return(<div class="bg-indigo-600">
  return (
    <div class="bg-accent">
      {/* <div class="bg-customOrange" style={{ backgroundColor: 'var(--accent-color' }}> */}
      <div class="max-w-7xl mx-auto px-1 ">
        <div class="flex items-center justify-between flex-wrap">
          <div class="w-0 flex-1 flex items-center">
            <p class="ml-3 font-medium text-white truncate">
              <span class="">{text}</span>
            </p>
          </div>
          <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <a
              href={redirect}
              //   class="flex items-center justify-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 "
              class="flex items-center justify-center px-2 text-accent py-1 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white "
            >
              Learn more
            </a>
          </div>
          <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              class="-mr-1 flex p-1 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              onClick={onDismiss}
            >
              <span class="sr-only">Dismiss</span>
              <svg
                class="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
