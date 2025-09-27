export function Metrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
        <p className="text-gray-600">Nombre total d'analyses effectuées</p>
        <p className="text-3xl font-bold text-blue">1,247</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Utilisateurs</h2>
        <p className="text-gray-600">Utilisateurs enregistrés</p>
        <p className="text-3xl font-bold text-green">892</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Revenus</h2>
        <p className="text-gray-600">Salaire moyen analysé</p>
        <p className="text-3xl font-bold text-pink">€52,400</p>
      </div>
    </div>
  );
}
