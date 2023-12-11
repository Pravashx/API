# Ecommerce Project 
## Feature List out
- Frontend 
    - landing 
        - Sliders/banners 
        - Category list 
        - Brand List
        - Product List 
    - Category/Brands/Search product List page
    - Product detail page 
    - Static pages
    - Auth And Authorization 
    - Cart Page 
    - Checkout Payment
    - Offers 
- CMS(Content Management System)
    - Banner CRUD       => 4
    - Category CRUD 
    - Brand CRUD
    - User CRUD 
    - Product CRUD (1000, 600)
    - Order View 
    - Transactions 
    - Offers CRUD 

## MVC 
### Routing 
- Defining the path for the url to perform actions 
- REST API
    - get, post, put, patch, delete 
    CRUD => 

    Create      => Post 
    Read        => get 
    Update      => put/patch 
    delete      => delete

    
    - Representational Stateless Transfer 

    - login ====> API ====> Process =======> Response 
8

    login request ====> Token 
    webstoreage token  ====> SERVER


### Folder Architecture
    MVC 

    a. Modular 
        src/
            app/
                auth/
                    router....,
                    controller....
                    model...
                    services....
                    validators...
                    tranformer...
                category/
                    router....,
                    controller....
                    model...
                    services....
                    validators...
                    tranformer...
                brand/
                    router....,
                    controller....
                    model...
                    services....
                    validators...
                    tranformer...
            config/
            router/

    b. Collective

        src/
            config/
            router/
                index.js 
                ....routes
            controller/
                auth.controller.js
                .... controller 
            models/
                .....

### SMTP Server
    - gmail 


                                            cloud
                        SMTP SERVER
Node    SMTP, 25
        IMAP, POP3 => 
                25, 2525, 465, 587

                127.0.0.1, ::1, localhost
                form: admin@sandeshbhattarai.com.mp


Register ===> Url FE ====== Activation token =====> Email 
    FEURL =====> API Verify token ========> Respnose ACK
    Set Password ====== TOKEN, password ======> Activate User ---------> email
    Login API ======= username, password ========> Login (jwt token)
    loggedin profileGet  ===== jwt token ====> Verify =====> Access 
 

 Product 
    price 
    discount 
        number, %
    afterDis 
        => logic 
        percent         flat 

NoSQL 
    Mongodb
    couchDb


Local setup 
    - laptop 
Could Server
    - atlas server

- Mongodb Server 
- Mongodb Compass 
- Mongodb Shell


- Edit environment 


protocol 
host 
port 
user 
password 
db

local 
    url => 
        mongodb://127.0.0.1:27017/dbName

    Atlas url =>
        mongodb+srv://username:password@atlasUrl/dbName

table
            column      column      column
Row Set     cell1       cell2       cell3


users 
            id          name            email 
Row         1           Ram             ram@gmail.com
Row         2           ["first", "last"]


Json Document Str 
table   ====> collection 
Row     ====> document ---> In json format
                {"key": value}
Column  ====> document keys

[{
    "name": "Sandesh Bhattarai",
    "email": "sandesh.bhattarai@test.com",
    "role": ObjectId("652f362decf0ef3369ecd0fb"),
    "status": "inactive",
    "token": "rMBja99LYahmFyTLthvloXL4Gea3SMEhBsXX2jmNEKaZkkgleAJMJdNoAWXCjBtsJhtQkQWHQmiqWBveExgfwvzmJxJgS75PoRiB"
},
{
    "name": "User Data",
    "email": "user@data.com",
    "role": ObjectId("652f362decf0ef3369ecd0fc"),
    "status": "inactive",
    "token": "rMBja99LYahmFyTLthvloXL4Gea3SMEhBsXX2jmNEKaZkkgleAJMJdNoAWXCjBtsJhtQkQWHQmiqWBveExgfwvzmJxJgS75PoRtY"
}]

.find(filter)
.findOne(filter)

{key:value, key1: value}
/// .... where key = value and key1 = value 

{$operation: {key: value}}

{key: {$operation: value}}

role: admin, customer
.find({
    $and: [
        {
            $or: [
                <!-- {role: "admin"},
                {role: "customer"},
                {role: "seller"}, -->
                {role: {$in: ["admin", "customer", "seller"]}}
                {$gte: {age: 10}}
            ]
        },
        {status: "active"}
    ]
})
//... where (role IN ('admin', 'customer', 'seller') or age >=10) and status = 'active'

// ... where (role = "admin" or role ="customer" or role = 'seller'
// or age >= 10) AND status = 'active'

.find(filter, projection)


.updateOne(filter, ..., {upsert: true})
.updateMany()



Chunk                       10000
    - Stage 1 
        -> filter 1         5000
            - Stage 2       
                -> filter 2 1000

                [
                    {}
                ]


roles 
_id  name 
1   admin 
2   users


users 
_id     name        roleId
1       Ram             1
2       Shyam           2
3       Raju            1


fetch 
id      name        role 
1       Ram         admin
2       Shyam       users
3       Raju        admin


.aggregate([
    {
        $lookup: {
            
        }
    }
])

[
    {
        $lookup: {
            from: "roles", 
            localField: "role", 
            foreignField: "_id", 
            as: "role"
        }
    }, 
    {
        $unwind: "$role"
    }
]


[
  {
    '$lookup': {
      'from': 'roles', 
      'localField': 'role', 
      'foreignField': '_id', 
      'as': 'role'
    }
  }, {
    '$unwind': {
      'path': '$role'
    }
  }, {
    '$match': {
      'role.name': 'users'
    }
  }
]

Create a database assuming Ecommerce as a project. 
Identify the Tables, and data logics. 
Design a database to store all the data.
List out the queries to find/insert/update/delete the data across multiple tables. 

Ecommerce => 
    * tables
        data property 

        users 
            -> 10 users 
        roles
            -> admin, seller, customer
        brands 
            -> 
        category 
        products 
        orders 
        

Core Driver 
    - mongodb
ORM/ODM Provider 
    - Mongoose

ORM 
ODM 
    
    columns
Row 


Table   => Plural
    -> users 
Model   => singular
    -> User

        Column 
Row     ----

users 
id      name        email 
1       Test        test@test.com

Dataset 
Row     ====> Object Model 

user => {
    id, name, email
}

key: Value


1 step ===> Email Address register 
        ===> Verify email, verify user exists 
        ===> 
            resetToken: random string,
            resetExpiry: => Date => 2023-11-03 07:05:00 => 

2 step ===> Send email to the email address with the link 
            // http://localhost:5173/set-password/resetToken

3 Step ===> API to set Password with reset token as params 
        ===> Check token is valid or not with resetExpiry time not greater then now 
        ===> Update the password 
        


Register ====> Email (url token ---> FE domain/path/token)
users => status: "inactive", token: "token

Verify 
verify ===> /auth/verify/token  ==> users.find()

Set Password
set ===> /auth/set-password/token 
    -> {password: encPass, status: "active", token: null} update 


Login 
login ===> /auth/login 
    username/email, 
    password    


// user detail => email 
    // status => 'inactive'


    let today = new Date(); // string 
    // 2023-11-10T07:00:00
    7
    today.setHours(today.getHours()+24)

    let today = Date.now()  // timestamp
    let today = today + (86400000)

    // Date => timestamap 


Ecommerce: 
    Auth Module 

    Client 
        BE 
            - Banner 

        Category
        {
            name: {
                en: "Caegory name",
                np: "Category Name"
            } 
        }
        {
            name: {
                en: "Caegory name",
                np: "Category Name"
            } 
        }

        Entry 
        {
            title: "A",
            lang: "en"
        }

        [
            {
                title: "Translated", 
                lang: "np"
            }

        ]



        // list 

        FE 
            -


Appliction 
    Api Gateway 

    

Product 
Qty 
Price
Discount
User Detail
Address
Paymetn Detail

Cart 
    product, 
    qty
Buyer


Product 
    name
    images 
    price 
    discount 
    description 
    attributes  ---> Attributes
    category 
    sku 
    stock 
    seller 
    brand 

Brand 
    name 
    logo 
    slug
    description 
    status 
Seller 
    User 
Category 
    name 
    description 
    icons 
    parent ---> Category
    attributes ---> Attributes
Attributes 
    id 
    name 
    value 

Banner
    image 
    url 
    title
    startTime
    endTime 
    position/priority
    showOnPopup boolean
    status [active, inactive] // Flag
Pages 
Blogs 


Apple ===> string hex

Appl Brand ===> apple-brand apple_brand apple brand
 // url apple ===> url/brand/123abcd
// url/brand/apple%20Bbrand
// BE 

Apple ==> apple
// url/brand/apple

Apple Brand 
// url/brand/apple

R
W
D
X


DWRX 

3 users 

Admin, group, user 
777
755
765
744
655

Agent => group 
sudo
user

AGU
777

7 => DWRX
6 => WRX
5 => RX
4 => X


Category 
    name/title
    slug
    descritpion 
    parentId ---> Foreign Key
        ref -  self 
        parentId: {
            type: mongoose.Types.ObjectId, 
            ref: 'Category',
            nullable: true
        }
    status 
    brands [
        {
            type: mongoose.Types.ObjectId, 
            ref: "Brand"
        }
    ]
    image 
    createdBy 

_id  title           slug           description  parentId    status  brand
------------------------------------------------------------------------
1   Electronics     electronics     null        null         active  [1]
------------------------------------------------------------------------
2   Television      television      null        1
------------------------------------------------------------------------
3   Smart Tv        smart-tv        null        2                    [1]
------------------------------------------------------------------------
4   Fridge          fridge          null        1