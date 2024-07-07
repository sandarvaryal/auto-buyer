export default function DarazAccountInstances({
  addedDate,
  url,
  dropped,
}: {
  addedDate: string;
  url: string;
  dropped: boolean;
}) {
  return (
    <>
      <h1>url: {url}</h1>
      <h2>Added Date: {addedDate}</h2>
      <h3>Status: {dropped && "Prices met criteria"}</h3>
    </>
  );
}
