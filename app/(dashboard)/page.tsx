"use client";

import { memo } from 'react';
import Feed from '@/components/Feed';

import NewPostForm from '@/components/NewPostForm';
import useStore from "@/store";
import {useSubscribe} from "nostr-hooks";
import {useProfileContacts} from "@/hooks";

const DEFAULT_PUBKEY = '4523be58d395b1b196a9b8c82b038b6895cb02b683d0c253a955068dba1facd0';

const HomeFeed = () => {
  const userData = useStore((state) => state.auth.user.data);
  const relays = useStore((store) => store.relays);
  const {
    latestContactEvent,
  } = useProfileContacts(userData?.publicKey || DEFAULT_PUBKEY);
  const authors = latestContactEvent?.tags?.filter((tag) => tag[0] === "p").map((tag) => tag[1]) || [];

  const { events, eose } = useSubscribe({
    relays,
    filters: [{ authors, kinds: [1], limit: 100 }],
    options: { invalidate: true, enabled: !!authors?.length },
  });

  const isEmpty = eose && !events.length;


  return (
    <>
      {userData?.publicKey ? (
        <div className="hidden md:block">
          <NewPostForm />
        </div>
      ) : null}
      <Feed events={events} isEmpty={isEmpty} />
    </>
  );
};

export default memo(HomeFeed); // memo probably shouldn't be used here

