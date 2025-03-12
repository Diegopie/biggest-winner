import { Link } from "react-router";

export default function TempNav() {

  return(
    <nav className="flex h-12 border-b items-center px-12">
      <Link to="/" className="w-18">Home</Link>
      <ul className="grow flex gap-3 justify-end">
        <li>
          <Link to="/place">Place</Link>
        </li>
        <li>
          <Link to="/place">Place</Link>
        </li>
        <li>
          <Link to="/place">Place</Link>
        </li>
      </ul>
    </nav>
  )
}