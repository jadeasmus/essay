import Link from "next/link";
import Layout from "../components/Layout";

// reads in essays stored in supabase

const IndexPage = () => (
  <Layout title="Essay">
    {/* Posts */}
    <h1 className="flex w-2/3 h-32 m-auto bg-slate-200 items-center justify-center">
      Essay Card
    </h1>
  </Layout>
);

export default IndexPage;
