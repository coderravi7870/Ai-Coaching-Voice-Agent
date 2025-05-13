
import { v } from "convex/values"
import {mutation} from "./_generated/server"

export const createUser = mutation({
    args:{
        name: v.string(),
        email: v.string(),
    },
    handler:async (ctx , args) => {
        // if User already exist
        const userData = await ctx.db.query('users')
        .filter(q=>q.eq(q.field('email'),args.email))
        .collect();

        // if not then add new user
        if(userData?.length == 0){
            const data = {
                name:args.name,
                email: args.email,
                credits: 5000
            }
            const result = await ctx.db.insert('users',data);

            return result;
        }
        return userData[0];
    }
});

export const UpdateUserToken = mutation({
    args:{
        id:v.id('users'),
        credits:v.number()
    },
    handler:async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            credits: args.credits
        })
    }
})

export const updateCreditsAndSubscription = mutation({
    args:{
        id:v.id('users'),
        credits: v.number(),
        subscriptionId: v.string()
    },
    handler: async (ctx,args)=>{
        await ctx.db.patch(args.id,{
            credits: args.credits,
            subscriptionId: args.subscriptionId
        })
    }
})

