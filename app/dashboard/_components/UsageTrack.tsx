"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { AIOutput, UserSubscription } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import { HISTORY } from "../history/page";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import Link from "next/link";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

function UsageTrack() {
  const { user } = useUser();
  const {totalUsage, setTotalUsage} = useContext(TotalUsageContext)
  const {userSubscription,setUserSubscription} = useContext(UserSubscriptionContext);
  const [maxWords,setMaxWords]=useState(10000)
  const {updateCreditUsage,setUpdateCreditUsage}=useContext(UpdateCreditUsageContext)

  
  useEffect(() => {
   user&&GetData();
   user&&IsUserSubscribe();
  }, [user]);

  useEffect(()=>{
    user&&GetData();
  },[updateCreditUsage&&user]);

  const GetData = async()=>{
    {/*@ts-ignore*/ }
    const result:HISTORY[] = await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, user?.primaryEmailAddress?.emailAddress));
    GetTotalUsage(result)

  }

  const IsUserSubscribe=async()=>{
     {/* @ts-ignore */}
     const result=await db.select().from(UserSubscription).where(eq(UserSubscription.email,user?.primaryEmailAddress?.emailAddress));
     if(result){
      setUserSubscription(true)
      setMaxWords(1000000);
    }
     console.log(result)
  }

  const GetTotalUsage = (result:HISTORY[]) => {
    let total: number = 0;
    result.forEach((element) => {
      total = total + Number(element.aiResponse?.length);
    });
    setTotalUsage(total);
    console.log(total);
  };

  return (
    <div className="m-5">
      <div className="bg-primary text-white p-3 rounded-lg">
        <h2 className="font-medium mb-2">Credits </h2>
        <div className="h-2 bg-[#9981f9] w-full rounded-lg mb-2">
          <div
            className="h-2 bg-white rounded-full transition-all duration-1000"
            style={{
              width:(totalUsage/maxWords)*100+"%",
            }}
          ></div>
        </div>
        <h2 className="text-sm">{totalUsage}/{maxWords} Credit use</h2>
      </div>
      <Link href={'/dashboard/billing'}>
      <Button variant={"secondary"} className="w-full my-2 text-primary">
        Upgrade
      </Button>
      </Link>
    </div>
  );
}

export default UsageTrack;
