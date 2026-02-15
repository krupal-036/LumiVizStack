export default function CardView({ item }) {
  return (
    <div className="border p-4 rounded">
      {JSON.stringify(item)}
    </div>
  );
}
