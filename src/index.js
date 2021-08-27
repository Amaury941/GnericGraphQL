const {ApolloServer, gql} =  require('apollo-server');

const typeDefs = gql`
    type Query {
        genesysOne: String
        getFathers:[Father!]!
        getFatherById(id: String!):Father!
    }

    type Father {
        _id  : ID!
        name : String!
        age  : Int!
        son  : Son
        skipSon: Boolean!
    }

    type Son {
        _id  : ID!
        name : String!
        age  : Int!
    }

    type Mutation {
        addFather (
            name: String!,
            age: Int!,
        ): Father!,
        
        addSon (
            FatherId: String!,
            name: String!,
            age: Int!,
        ): Son!,
    
    }

`;

const fathers = [
    {_id:"0", name:"adam",age:99, son: {name:"Abel", age:22},skipSon:true},
    {_id:"1", name:"noah",age:35, son: {name:"Michael", age:19}}
]

const resolvers = {
    Query: {
        genesysOne: () => "In the beginning, God created the heavens and the earth.", //essa query retorna a mensagem
        getFathers: () => fathers,
        getFatherById: (_,args) => {
            return fathers.find((user)=> user._id === args.id)
        },
    },

    Mutation: {
        addFather: (_,args) => {
            const newFather = {
                _id: String(fathers.length),
                name: args.name,
                age:args.age,
            };
            fathers.push(newFather);
            return newFather;
        },

        addSon: (_,args) => {
            const newSon = {
                _id  : String(args.FatherId + "'" +'s son'),
                name : args.name,
                age  : args.age
            };

            const newFather = {
                _id  : String(args.FatherId),
                name : fathers.find((user)=> user._id === args.FatherId).name,
                age  : fathers.find((user)=> user._id === args.FatherId).age,
                son  : newSon
            };

            fathers.splice(parseInt(args.FatherId),1,newFather)
            return newSon;
        } 

    },

};

const server = new ApolloServer({typeDefs,resolvers});
server.listen().then(({url}) => console.log(`server started at ${url}`));