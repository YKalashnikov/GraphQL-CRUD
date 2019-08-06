const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");
const fetch = require("node-fetch");


const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {

        return fetch("http://localhost:3000/customers/" + args.id).then(res =>
          res.json()
        );
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return customers;
      }
    }
  }
});
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return fetch("http://localhost:3000/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
          name: args.name,
          email: args.email
          })
        }).then(res => res.json());
      }
      
    },
    deleteCustomer: {
        type: CustomerType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(parentValue, args) {
          return fetch("http://localhost:3000/customers/"+args.id, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },        
          }).then(res => res.json());
        }
      },
      editCustomer: {
        type: CustomerType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          name: { type:  GraphQLString },
          email: { type:  GraphQLString }
        },
        resolve(parentValue, args) {
          return fetch("http://localhost:3000/customers/"+args.id,{
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },      
            body: JSON.stringify(args)     
          }).then(res => res.json());
        }
      }
  }
});



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
