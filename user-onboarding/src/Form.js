import React,{useState, useEffect} from 'react';
import * as yup from 'yup';
import axios from 'axios';

function Form(){
    //users - array to store obj data returned from Post
    const [users,setUsers]=useState([{fname:"Kavya",role: "Solution Architect"},{fname:"Tulsi",role: "Front End Engineer"},{fname:"Amulya",role: "Project Manager"},{fname:"Shini",role: "UX Designer"}])

    // server error
    const [serverError, setServerError] = useState("");

    // temporary state used to display response from API. this is not a commonly used convention
    const [post, setPost] = useState([]);

    // state to manager form inputs
    const [formState,setFormState]=useState({
        fname:"",
        role:"Front End Engineer",
        email:"",
        password:"",
        confirmPassword:"",
        terms:false
    })

    //submit button to be disabled until all the fields are valid in form
    const [isButtonDisabled,setButtonDisabled]=useState(true)
    
    //define Schema for input validation
    const formSchema=yup.object().shape({
        fname:yup.string()
        .required("Your Name is a requried field!")
        .test(
            "This Name is already in the team list",
             value => (users.map(item=> {
                 return (item.fname !== value)
             }) 
            
        )),
        
        role:yup.string()
        .oneOf(["Front End Engineer",
        "UX Designer", "Solution Architect", "Project Manager"])
        .required("Required! please choose one"),

        email:yup.string()
        .email("Please enter a valid email")
        .notOneOf(["waffle@syrup.com"],"Sorry this user already exists!")
        .required("Email is a required field!"),
        
        password:yup.string()
        .required("Password is required")
        // .min(8, "Password is too short - should be 8 chars minimum.")
        // .matches(/(?=.*[0-9])/, "Password must contain a number.")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
          ),
      
        confirmPassword: yup.string()
          .required('Required field')
        //   .oneOf([yup.ref('password'), null], "Passwords don't match!"),
          .when("password", {
            is: val => (val && val.length > 0 ? true : false),
            then: yup.string()
            .oneOf([yup.ref("password")],"Both password need to be the same")
          }),
         
        terms:yup.boolean()
        .oneOf([true])
        .required("Please click to agree Terms & Conditions"),
    })

    //error state variable

    const [errorState,setErrorState]=useState({
        fname:"" ,
        role:"",
        email:"",
        password:"",
        confirmPassword:"",
        terms:""
    })

    //onChange function
    const handleChange=(e)=>{
        e.persist();
        const value= (e.target.type==="checkbox") ? e.target.checked : e.target.value
        //validate with yup before setting state
        validate(e);
        console.log("error values=",errorState)
        setFormState({...formState,[e.target.name]:value})
    }

    const validate =(e)=>{
    //reach to indv schema and then its key => validate(value)=> this is a promise
        yup.reach(formSchema,e.target.name)
        .validate((e.target.type==="checkbox") ? e.target.checked : e.target.value)
        .then(valid =>{
            //reset errors state to spaces to clear prev errors
            console.log('im here to clear...',e.target.name)
            setErrorState({...errorState,[e.target.name]:""})
        }
        )    
        .catch((err)=>{
        console.log('err in validate=',err.errors)
        setErrorState({...errorState,[e.target.name]:err.errors[0]})    
        })


    }

    //onSubmit function
    const handleSubmit =(e)=>{
        e.preventDefault();
        console.log('onsubmit state=',formState)
        axios
         .post("https://reqres.in/api/users", formState)
         .then((res)=>{
             // update temp state with value from API to display in <pre>
            setPost(res.data);
            console.log('Response post api =',res.data)
            setUsers([...users,res.data])
            //display data

             // if successful request, clear any server errors
            setServerError(null); 

            // clear state, could also use a predetermined initial state variable here
            setFormState({
             fname: "",
             role:"",
             email: "",
             password:"",
             confirmPassword:"",
             terms: false})
            })
        .catch((err) => {
            // this is where we could create a server error in the form! if API request fails, say for authentication (that user doesn't exist in our DB),
            // set serverError
            setServerError("oopsie Daisy! something happened!");
          });
    }
        //   console.log('users=',users)
    //useEffect is used to check everytime the form state is changed
    //state changes => we validate the entire form,and if valid then enable the submit button
    useEffect(()=>{
        formSchema.isValid(formState) //returns a promise-validating state
         .then((valid)=>{
             console.log('yay my form is valid=',errorState)
             setButtonDisabled(!valid)
         })
    },[formState])

    return(
        <form onSubmit={handleSubmit}>
        <label htmlFor="fname">
        Your Name    
        <input
         onChange={handleChange}
         id="fname"
         type="text"
         name="fname"
         value={formState.fname}
         placeholder="Enter your sweet name"/>  
         {errorState.fname.length>0 ? <p className="error">{errorState.fname}</p> : null}
        </label>
        <label htmlFor="role">
        Choose Your Role!
        <select
        id="role"
        name="role"
        value={formState.role}
        onChange={handleChange}
        >
      <option value="">Choose---One</option>
      <option value="Front End Engineer">Front End Engineer</option>
      <option value="UX Designer">UX Designer</option>
      <option value="Solution Architect">Solution Architect</option>
      <option value="Project Manager">Project Manager</option>
      </select>
       {errorState.role.length>0 ? <p className="error">{errorState.role}</p> : null}    
      </label>

        <label htmlFor="email">
        Email
        <input
        onChange={handleChange}
        type="email"
        id="email"
        name="email"
        value={formState.email}
        placeholder="Your email id"
        />
        {errorState.email.length>0 ? <p className="error">{errorState.email}</p> : null}
        </label>
        
        <label htmlFor="password">
        Password
        <input
         onChange={handleChange}
        type="password"
        id="password"
        name="password"
        value={formState.password}
        placeholder="Your Password"
        />
         {errorState.password.length>0 ? <p className="error">{errorState.password}</p> : null}
        </label>

        
        <label htmlFor="confirmPassword">
        Confirm Password
        <input
         onChange={handleChange}
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formState.confirmPassword}
        placeholder="Confirm Password"
        />
         {errorState.confirmPassword.length>0 ? <p className="error">{errorState.confirmPassword}</p> : null}
        </label>

        <label htmlFor="terms" className="terms">
         Terms and Conditions:
         <input
         className="terms"
         onChange={handleChange}
         type="checkbox"
         id="terms"
         name="terms"
         checked={formState.terms}/>   
         {errorState.terms.length>0 ? <p className="error">{errorState.terms}</p> : null}
        </label>

        <button type="submit"
        onClick={handleSubmit}
        disabled={isButtonDisabled}>Submit</button>
        {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
        <h4>Our Team !</h4>
        <div className="info">{users.map((item)=> {
            return <div key={item.fname}> <li>{item.fname} | {item.role}<br/></li> </div>
        }
        )}</div>
        </form>
    )
}

export default Form;