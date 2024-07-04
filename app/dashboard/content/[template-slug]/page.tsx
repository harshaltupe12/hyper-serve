"use client";
import React, { useState } from "react";
import FormSection from "../_component/FormSection";
import OutputSection from "../_component/OutputSection";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Template from "@/app/(data)/Template";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { chatSession } from "@/utils/AiModel";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

interface PROPS {
  params: {
    "template-slug": string;
  };
}

function CreateNewContent(props: PROPS) {
  const selectedTemplate: TEMPLATE | undefined = Template?.find(
    (item) => item.slug == props.params["template-slug"]
  );

  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>('');
  const {user} = useUser();

  const GenerateAIContent = async(formData: any) => {
    setLoading(true);
    const SelectedPrompt=selectedTemplate?.aiPrompt;
    const FinalAIPrompt = JSON.stringify(formData)+", "+SelectedPrompt;

    const result=await chatSession.sendMessage(FinalAIPrompt);
    console.log(result.response.text());
    setAiOutput(result?.response.text())
    await SaveInDb(JSON.stringify(formData),selectedTemplate?.slug,result?.response.text())
    setLoading(false);
  };

  const SaveInDb=async(formData:any,slug:any,aiResp:string)=>{
    const result=await db.insert(AIOutput).values({
        formData:formData,
        templateSlug:slug,
        aiResponse:aiResp,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD/MM/yyyy'),
    });

    console.log(result);
}
  return (
    <div className="p-5">
      <Link href={"/dashboard"}>
        <Button>
          <ArrowLeft /> Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        {/* Form Section */}
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading}
        />

        {/* Output Section */}
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
}

export default CreateNewContent;
