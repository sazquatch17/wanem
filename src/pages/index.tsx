import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { type RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

const CreateMigraineWizard = () => {

  const { user } = useUser();

  if(!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <Image 
        src={user.profileImageUrl}
        alt="Profile Image"
        className="w-14 h-14 rounded-full"
        width={56}
        height={56}
      />
      <input 
        placeholder="Enter some Content" 
        className="grow bg-transparent outline-none"
      />
    </div>

  )
};

type MigraineWithUser = RouterOutputs["migraines"]["getAll"][number];
const MigrainView = (props: MigraineWithUser) => {
  const {migraine, user} = props;
  return (
    <div key={migraine.id} className="border-b border-slate-400 p-4 flex">
      <Image 
        src={user.profileImageUrl}
        className="w-14 h-14 rounded-full"
        alt={` ${user.username}'s Profile Image`}
        width={56}
        height={56}
      />
      <div>
        <div className="flex text-slate-100 gap-1">
          <span>{user.username}</span>
          <span className="font-thin">{`· ${dayjs(migraine.createdAt).fromNow()}`}</span>
        </div>
        <span>{migraine.content}</span>
      </div>
    </div>
  )
};

const Home: NextPage = () => {
  const user = useUser();

  const { data,isLoading } = api.migraines.getAll.useQuery();

  if(isLoading) return <div>Loading...</div>
  if(!data) return <div>No data yet...</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <div className="flex border-b border-slate-400 p-4">
          {!user.isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {!!user.isSignedIn && (
            <div className="flex justify-center">
              <CreateMigraineWizard />
              <SignOutButton />
            </div>
          )}
        </div>
        <div className="flex flex-col">
        {[...data, ...data]?.map((fullMigraine) => (
          <MigrainView {...fullMigraine} key={fullMigraine.migraine.id}/>
        ))}
        </div>
      </main>
    </>
  );
};

export default Home;
