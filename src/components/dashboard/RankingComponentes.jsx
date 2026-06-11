export default function RankingComponentes({ data }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Componente</th>
          <th className="p-2">Cantidad</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="text-center">
            <td className="p-2">{item.name}</td>
            <td className="p-2">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}