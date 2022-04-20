import { Link } from "react-router-dom";

export function Header(props) {
  const { cmsData } = props;
  return (
    <header className="w-full bg-yellow-300">
      <div className="max-w-[1200px] mx-auto flex flex-row justify-end px-4 py-3">
        <nav className="flex flex-row">
          {cmsData?.map((page) => {
            return (
              <Link
                key={`nav-${page.Url}`}
                className={`list-none ml-4 first:ml-0 uppercase text-lg ${
                  page.Url === window.location.pathname ? "underline" : ""
                }`}
                to={page.Url}
              >
                {page.Sheet}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
