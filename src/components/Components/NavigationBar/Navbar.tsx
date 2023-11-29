import "./Navbar.css";
function Navbar(props: any) {
  return (
    <div className="navbar-outer">
      <nav>{props.children}</nav>;
    </div>
  );
}

export default Navbar;
