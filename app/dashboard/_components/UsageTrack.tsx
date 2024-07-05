"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useContext, useEffect, useState } from "react";
import { HISTORY } from "../history/page";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import Link from "next/link";

function UsageTrack() {
  const { user } = useUser();
  const {totalUsage, setTotalUsage} = useContext(TotalUsageContext)

  
  useEffect(() => {
   user&&GetData();
  }, [user]);

  const GetData = async()=>{
    {/*@ts-ignore*/ }
    const result:HISTORY[] = await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, user?.primaryEmailAddress?.emailAddress));
    GetTotalUsage(result)

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
              width:(totalUsage/10000)*100+"%",
            }}
          ></div>
        </div>
        <h2 className="text-sm">{totalUsage}/10,000 Credit use</h2>
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
