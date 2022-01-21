import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react/cjs/react.production.min";

import MeetupList from "../components/meetups/MeetupList";

export default function HomePage(props) {
  return (
    <Fragment>
      <Head>
          <title>Meetups</title>
          <meta name='description' content="Browse a huge list, and create your list"/>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// export async function getServerSideProps (context){
//     const req = context.req;
//     const res = context.res;

//     return {
//         props:{
//             meetups: DUMMY_DATAS
//         },

//     };
// }

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://ganbold:ganboldbna@cluster0.utecf.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}
