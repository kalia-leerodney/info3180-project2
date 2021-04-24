/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {
            
        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">United Auto Sales</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li v-if="!status_log" class="nav-item active">
            <router-link class="nav-link" to="/login">Login <span class="sr-only">(current)</span></router-link>
          </li>
          <li  v-if="!status_log"class="nav-item active">
            <router-link class="nav-link" to="/register"> Register <span class="sr-only">(current)</span></router-link>
          </li>
          <li  v-if="status_log" class="nav-item active">
          <router-link class="nav-link" to="/cars/new"> Add Car <span class="sr-only">(current)</span></router-link>
        </li>
          <li v-if="status_log" class="nav-item active">
          <router-link class="nav-link" to="/explore"> Explore <span class="sr-only">(current)</span></router-link>
        </li>
        <li v-if="status_log" class="nav-item active">
        <router-link class="nav-link" @click="profile()" v-bind:to="'/users/' + c_user">My Profile <span class="sr-only">(current)</span></router-link>
      </li>
          <li v-if="status_log" class="nav-item active">
            <router-link class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `,

    computed: {
        status_log: function() {
            if (sessionStorage.getItem('token')) {
                return true;
            } else {
                return false;
            }
        }
    },

    methods: {
        profile: function(){
            let self =this;
            this.$router.push("/users/"+self.c_user)
            location.reload();
        }
    },

    data: function(){
        return {
            c_user: 0
        }
    },

    created: function(){
        let self = this;
        fetch('/api/secure', {
            'headers': {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(function (response) {
                return response.json();
            }).then(function (response) {
                let result = response.data;
                self.c_user = result.user.userid;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
});

// app.component('app-footer', {
//     name: 'AppFooter',
//     template: `
//     <footer>
//         <div class="container">
//             <p>Copyright &copy; {{ year }} Flask Inc.</p>
//         </div>
//     </footer>
//     `,
//     data() {
//         return {
//             year: (new Date).getFullYear()
//         }
//     }
// });

const Home = {
    name: 'Home',
    template: `
    <div class = 'home-page'>
        
        <div class = "middle">
            <h2> Buy and Sell Cars Online </h2>
            <p> United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online</p>

            <div class = 'btns'>
                <button id="reg_btn" @click="$router.push('register')" type="button" class="btn btn-success">Register</button>
                <button id="login_btn" @click="$router.push('login')" type="button" class="btn btn-primary">Login</button>
            </div>
        </div>
    
    </div>

    `,
    data() {
        return {}
    }
};


const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

const LoginForm = {
    name: "login-form",
     data(){
         return{
    //         isSuccessUpload:false,
             displayFlash:false,
    //         successmessage:"",
             errormessage:"",
            
         }
     },

    template:`
    <div class = 'login-container'>
        <h2> Login to your account </h2>

        <div class="alert alert-danger" v-if="isError">
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </div>
    
        <form v-on:submit.prevent="loginUser" method="POST" enctype="multipart/form-data" id="loginForm">

        <div class="card">
            <div class = "form-group">

                <label> Username </label><br>
                <input type="text" name="username" class="form-control"><br>

                <label> Password </label><br>
                <input type="password" name="password" class="form-control"><br>
                <button class="btn btn-success" > Login </button>
            </div>
                
            </div> 
        </form>
    </div>
    
    `,data: function() {
        return {
            token: '',
            errors:[],
            isError: false
        }
     },
    methods: {
        loginUser(){
            let self = this;
            let loginForm = document.getElementById('loginForm');
            let form_data = new FormData(loginForm);
            fetch("/api/auth/login", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                    console.log(jsonResponse)
                    
                if (typeof jsonResponse.data === 'undefined'){
                    console.log(jsonResponse.message);
                    self.isError=true;
                    //self.isSuccess=false;
                    self.errors = [jsonResponse.message];
                    
                }
                if (jsonResponse.errors) {
                    self.isError=true;
                    self.isSuccess=false;
                    self.errors = jsonResponse.errors;
                }
                else{
                        console.log(jsonResponse.message);
                        let tkn_jwt = jsonResponse.data.token;
                        sessionStorage.setItem('token', tkn_jwt);
                        console.info('Token stored in sessionStorage.');
                        self.token = tkn_jwt;
                        router.push("/explore")}
                
                })
                .catch(function (error) {
                console.log(error);
                });

            }

    },  

};

const Logout = {
    name:"logout",
    template:`
        <div>Logging out...</div>
    
    `,

    methods: {
        logOut: function () {
            let self = this;
            fetch("/api/auth/logout", { method: 'POST', headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),'X-CSRFToken': token}})
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    let result = response.data;
                    alert(result.user.username + " logged out!")
                    sessionStorage.removeItem('token');
                    console.info('Token removed from sessionStorage.');
                    router.push("/")
                    
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    },

    beforeMount(){
        this.logOut()
    }
};

    


const RegisterForm = {
    name: "register-form",
     data(){
         return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
             errormessage:"",      
         }
     },

    template:`
    <div class='register-container'>
        <h2> Register New User </h2>

        <div class="alert alert-success" v-if="isSuccess">
            <p v-for="success in successMessage">{{ success }}</p>
        </div>
    
        <div class="alert alert-danger" v-if="isError">
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </div>
    
        <form v-on:submit.prevent="registerUser" method="POST" enctype="multipart/form-data" id="registerForm">
        
            <div class= "regcard">
                <div class="form-group">

                    <div class = "form-row">
                        <div class = "col">
                            <label> Username </label><br>
                            <input type="text" class="form-control" name="username"><br>
                        </div>

                        <div class = "col">
                            <label> Password </label><br>
                            <input type="text" class="form-control" name="password"><br>
                        </div>
                    </div>

                    <div class = "form-row">
                        <div class = "col">
                            <label> Fullname </label><br>
                            <input type="text" class="form-control" name="fullname"><br>
                        </div>

                        <div class = "col">
                            <label> Email </label><br>
                            <input type="text" class="form-control" name="email"><br>
                        </div>
                    </div>

                    <label> Location </label><br>
                    <input type="text" class="form-control" name="location"><br>


                    <label> Biography </label><br>
                    <textarea name="bio" class="form-control" > </textarea><br>

                    <label> Upload Photo: </label><br>
                    <input type="file" name="pic" class="form-control-file" placeholder="Browse">

                </div>
            <div class="regbtn">
                <button class="btn btn-success" > Register </button>
            </div>
        
        </form>
    </div>

    `,
    data: function() {
        return{
            errors: [],
            successMessage: [],
            isSuccess: false,
            isError: false
        };
    },

    methods: {
        registerUser(){
            let self = this;
            let registerForm = document.getElementById('registerForm');
            let form_data = new FormData(registerForm);
            fetch("/api/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                console.log(jsonResponse);
                if (jsonResponse.errors) {
                        self.isError=true;
                        self.isSuccess=false;
                        self.errors = jsonResponse.errors;
                    }
                    else if (jsonResponse.jsonmsg) {
                        self.isError = false;
                        self.isSuccess = true;
                        self.successMessage = jsonResponse.jsonmsg;
                    }
                })
                
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            }

    },  

};

const CarForm = {
    name: "car-form",
        data(){
         return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
            errormessage:"",      
        }
     },

     template:`
     <div class = 'addcar-container'>
         <h2> Add New Car </h2>
 
         <div class="alert alert-success" v-if="isSuccess">
                 <p v-for="success in successMessage">{{ success }}</p>
         </div>
 
         <div class="alert alert-danger" v-if="isError">
                 <ul>
                     <li v-for="error in errors">{{ error }}</li>
                 </ul>
         </div>
     
     
         <form v-on:submit.prevent="registerCar" method="POST" enctype="multipart/form-data" id="carForm">
         <div class = "addcar-card">
             <div class="form-group">
 
                 <div class = "form-row">
                     <div class = "col">
                         <label> Make </label><br>
                         <input type="text" class="form-control" name="make"><br>
                     </div>
 
                     <div class = "col">
                         <label> Model </label><br>
                         <input type="text" class="form-control" name="model"><br>
                     </div>
                 </div>
 
                 <div class = "form-row">
                     <div class = "col">
                         <label> Colour </label><br>
                         <input type="text" class="form-control" name="colour"><br>
                     </div>
 
                     <div class = "col">
                         <label> Year </label><br>
                         <input type="text" class="form-control" name="year"><br>
                     </div>
                 </div>
 
                 <label> Price </label><br>
                 <input type="text" class="form-control" name="price"><br>
 
                 <div class = "form-row">
                     <div class="col">
                         <label> Car Type </label><br>
                         <select name="cartype" class="form-control"> 
                             <option value="SUV"> SUV </option>
                             <option value="Sports Car"> Sports Car </option>
                             <option value="Sedan"> Sedan </option>
                             <option value="Coupe"> Coupe </option>
                         </select><br>
                     </div>
 
             
                     <div class = "col">
                         <label> Transmission </label><br>
                         <select name="transmission" class="form-control"> 
                             <option value=Automatic> Automatic </option>
                             <option value=Manual> Manual </option>
 
                         </select><br>
                     </div>
                 </div>
 
                 <label> Description </label><br>
                 <textarea name="description" class="form-control"> </textarea><br>
 
                 <label> Upload Photo: </label><br>
                 <input type="file" name="pic">
 
             </div>
             <div class = "carbtn">
                 <button class="btn btn-success" > Save </button>
             </div>
         </div>
         </form>
     </div>
     
     `,

    data: function() {
        return{
            errors: [],
            successMessage: [],
            isSuccess: false,
            isError: false
        };
    },


    methods: {
        registerCar(){
            let self = this;
            let carForm = document.getElementById('carForm');
            let form_data = new FormData(carForm);
            fetch("/api/cars", {
                method: 'POST',
                body: form_data,
                headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token') ,
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
                     
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                //isSuccessUpload = true
                //this.successmessage = "File Uploaded Successfully"
                // display a success message
                console.log(jsonResponse);

                if (jsonResponse.errors) {
                    self.isError=true;
                    self.isSuccess=false;
                    self.errors = jsonResponse.errors;
                }
                else if (jsonResponse.jsonmsg) {
                    self.isError = false;
                    self.isSuccess = true;
                    self.successMessage = jsonResponse.jsonmsg;
                    //alert("Success")
                }
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            }

    },  

};

const Explore = {
    name: "explore",
    /*data(){
        return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
            errormessage:"",      
        }
    },*/

    template:`
    <div>
        <div class = "explore-container">
            <h2> Explore </h2>
            
        
            <form v-on:submit.prevent="exploreSearch" method="GET" enctype="multipart/form-data" id="searchForm">
            <div class = "explore-card">
                <div class="form-group">

                    <div class = "form-row">
                        <div class = "col">
                            <label> Make </label><br>
                            <input type="text" class = "form-control" name="searchbymake" v-model="searchMake"><br>
                        </div>

                        <div class = "col">
                            <label> Model </label><br>
                            <input type="text" class = "form-control" name="searchbymodel" v-model="searchModel"><br>
                        </div>
                    
                    </div>

                    <div class = "explore-btn">
                        <button class="btn btn-success" > Search </button>
                    </div>
                    
                </div>
            </div>
            </form>
            </div>

            <li v-for="car in allcars">
                
                    <div class = "card-group">
                        <div class ="details-card" style="width: 18rem;">
                            <img class="card-img-top" id="car_img" :src="'/static/uploads/'  + car.photo" alt="car img"> 
                                <div class = "card-body">
                                    <div class = "top-card">
                                        <h5 class = "card-title">  {{car.year}}  </h5>
                                        <h5 class= "card-title">  {{car.make}}  </h5>
                                        <img id = "price-tag" src = "/static/price-tag.png">
                                        <p class="card-text">  {{car.price}}  </p>
                                    </div>
                                    <p class="card-text">  {{car.model}}  </p>
                                </div>    
                            
                            <button @click="carinfo(car.id)" class="btn btn-primary"> View More Details </button>
                        </div>
                    </div>
                

            </li>

            
        
    </div>
    
    `,
    data: function() {
        return {
            allcars: [],
            userid: 0,
            searchMake: '',
            searchModel: ''
        }
     },

    methods: {
        exploreSearch(){
            let self = this;
            fetch('/api/search?searchbymake='+self.searchMake+ '&searchbymodel='+self.searchModel, {
                method: 'GET',
                headers:{ 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),'X-CSRFToken': token } 
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                self.allcars=jsonResponse.searchedcars
                console.log(jsonResponse);
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            },

            pagestart: function(){
                let self = this;
                fetch("/api/cars", { method: 'GET', headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }})
                        .then(function (response) {
                            return response.json();
                            })
                            .then(function (jsonResponse) {
                                // display a success message
                                self.allcars=jsonResponse.allcars.slice(-3);
                                console.log(jsonResponse.allcars.slice(-3));
                                console.log(jsonResponse.allcars);
                                
                            })
                            .catch(function (error) {
                                    console.log(error);
                                });
                    },
                    carinfo: function(car_id){ 
                        this.$router.push("/cars/"+car_id)
                       
                    },


    },
    created: function(){
        this.pagestart();
    }
};

const CarInfo = {
    name: "carinfo",
    props: ['car_id'],
    template: `

    <div>
        <div class="container-fluid">
            <div class="carinfocard">
                <div class="img-square-wrapper">
                    <img id="car_img" :src="'/static/uploads/' + photo" alt="car img" class="card-img-top"> 
                </div>

                <div class = "card-body">
                    <div class = "yearmake">
                            <h2 class = "card-title">  {{ year }} </h2> <br> 
                            <h2 class = "card-title"> {{ make }} </h2> 
                    </div>

                    <p class="model"> {{model}} </p>  
                    <p class="card-text"> {{description}} </p>

                    <div class = "form-row">
                        <div class = "col">
                            <label>Colour</label>
                            <p class="card-text"> {{colour}} </p> <br>
                        </div>

                        <div class = "col">
                            <label>Body Type</label>
                            <p class="card-text"> {{car_type}} </p> <br>
                        </div>
                    </div>



                    <div class = "form-row">
                        <div class = "col">
                            <label>Price</label>
                            <p class="card-text"> {{price}} </p> <br>
                        </div>

                        <div class = "col">
                            <label>Transmission</label>
                            <p class="card-text"> {{transmission}} </p> <br>
                        </div>
                    </div>

                    <div class = "carinfobtns">
                        <button class="btn btn-success" > Email Owner </button>

                        <button v-if="faved" type="button" class="btn btn-default btn-circle">
                            <img src="/static/heart.png"> 
                        </button>
                        <button v-else" @click="favouritecar(car_id)" type = "button" class="btn btn-primary" > Favourite </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    `,
    data: function() {
        return {
            
            year:"",
            price:0,
            model:"",
            description:"",
            colour:"",
            transmission:"",
            make:"",
            car_type:"",
            photo:"",
            faved:false

            

        }
     },created: function(){
        let self = this;
        this.viewCarinfo(self.car_id);
    },

    methods: {
        viewCarinfo(car_id){
            let self = this;
            fetch('/api/cars/' + car_id, {
                method: 'GET',
                headers:{ 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),'X-CSRFToken': token } 
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                self.year=jsonResponse.year;
                self.model=jsonResponse.model;
                self.make=jsonResponse.make;
                self.description=jsonResponse.description;
                self.colour=jsonResponse.colour;
                self.transmission=jsonResponse.transmission;
                self.photo=jsonResponse.photo;
                self.car_type=jsonResponse.car_type;
                self.price=jsonResponse.price;
                self.faved=jsonResponse.Faved;
                console.log(jsonResponse);
                
                
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            },
            favouritecar: function(car_id){
                fetch("/api/cars/" + car_id + "/favourite", { method: 'POST', headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token'), 'X-CSRFToken': token }, credentials: 'same-origin'})
                .then(function (response) {
                    return response.json();
                    }).then(function (jsonResponse) {
                        // display a success message
                        console.log(jsonResponse.message);
                        location.reload()
                    }).catch(function (error) {
                            console.log(error);
                        });
            },


        },
        
    };

    const UserInfo = {
        name: "userinfo",
        props: ['user_id'],
        template: `
    
        <div class= "user-container">

            <div class = "usercard">
                <div class = "card-horizonatal">
                    <img id="user_img" :src="'/static/uploads/' + user.photo" alt="user img" class = "card-img-left"> 
                </div>

                <div class="card-body">
                    <h2 class = "card-title">  {{user.name}} </h2>  <br> 
                    <h4 class = "card-text"> @{{user.username}} </h4>  
                    <p class = "card-text"> {{user.biography}} </p> <br>
                
                    <div class = "form-row">

                        <div class = "col">
                            <label>Email</label>
                            <p class="card-text"> {{user.email}} </p> <br>
                        </div>

                        <div class = "col">
                            <label>Location</label>
                            <p class="card-text"> {{user.location}} </p> <br>
                        </div>

                        <div class = "col">
                            <label>Joined</label>
                            <p class="card-text"> {{user.date_joined}} </p> <br>
                        </div>

                    </div>
                </div>
            </div>
       
        
        <h2> Cars Favourited </h2>

        
    <ul>
        <li v-for="car in allcars">
            <div class = "details-card-group">
                <div class ="details-card" style="width: 18rem;">
                    <img class="card-img-top" id="car_img" :src="'/static/uploads/'  + car.photo" alt="car img"> 
                        <div class = "card-body">
                            <div class = "top-card">
                                <h5 class = "card-title">  {{car.year}}  </h5>
                                <h5 class= "card-title">  {{car.make}}  </h5>
                                <img id = "price-tag" src = "/static/price-tag.png">
                                <p class="card-text">  {{car.price}}  </p>
                            </div>
                            <p class="card-text">  {{car.model}}  </p>
                        </div>    
                    
                    <button @click="carinfo(car.id)" class="btn btn-primary"> View More Details </button>
                </div>
            </div>
        </li>

    </ul>

    
        </div>
        `,
        data: function() {
            return {
                allcars: [],
                user:{}
            }
         },created: function(){
            let self = this;
            this.viewUserinfo(self.user_id);
            this.carsfavourited(self.user_id);
        },
    
        methods: {
            viewUserinfo(user_id){
                let self = this;
                fetch('/api/users/' + user_id, {
                    method: 'GET',
                    headers:{ 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),'X-CSRFToken': token } 
                   })
                    .then(function (response) {
                    return response.json();
                    })
                    .then(function (jsonResponse) {
                    self.user=jsonResponse.user;
                    })
                    .catch(function (error) {
                    //this.errormessage = "Something went wrong"
                    console.log(error);
                    });
    
                },
                carsfavourited: function(user_id){
                    let self = this;
                    fetch("/api/users/" + user_id + "/favourites", { method: 'GET', headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token'), 'X-CSRFToken': token }, credentials: 'same-origin'})
                    .then(function (response) {
                        return response.json();
                        }).then(function (jsonResponse) {
                            // display a success message
                            self.allcars=jsonResponse.favouritecars
                            console.log(jsonResponse);
                        }).catch(function (error) {
                                console.log(error);
                            });
                },
                carinfo: function(car_id){ 
                    this.$router.push("/cars/"+car_id)
                   
                },
    
    
            },
            
        };
        
    
    






// Define Routes
const routes = [
    { path: "/", component: Home },
    { path: "/register" , component: RegisterForm},
    { path: "/login" , component: LoginForm},
    { path: "/cars/new" , component: CarForm},
    { path: "/explore" , component: Explore},
    { path: "/cars/:car_id" , component: CarInfo,props:true},
    { path: "/logout" , component: Logout},
    { path: "/users/:user_id" , component: UserInfo,props:true},
   


    
    // Put other routes here

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');
