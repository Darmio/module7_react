
function Header(props) {
 
    function loginBtn() {
        props.showLoginForm(true);
    }

    function logoutBtn() {
        localStorage.setItem('isAuth', 'false');
        localStorage.setItem("userName", "guest");
        localStorage.setItem("token", "");
        props.setUserCredentials({userName: "guest"});
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          
       <a className="navbar-brand" href="/">Home</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button> 
      
       <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="/certificates">Certificates</a>
            </li>
          </ul>
        </div>
        <div>
                    <span className="me-3">{props.userName}</span>
                    <button type="button" 
                        onClick={loginBtn}
                        className="btn btn-secondary"
                        hidden={props.userName !== 'guest' && props.userName !== ""}>
                            Login
                    </button>
                    <button type="button" 
                        onClick={logoutBtn} 
                        className="btn btn-secondary"
                            hidden={props.userName === 'guest' || props.userName === ""}>
                                Logout
                    </button>
                </div>
     </nav>
    );
}

export default Header;
