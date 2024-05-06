using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.BLL.Interfaces;
using Firebase.Auth;
using Firebase.Storage;
using SistemaVenta.Entity;
using SistemaVenta.DAL.Interfaces;
using Firebase.Auth.Providers;

namespace SistemaVenta.BLL.Implementacion
{
    public class FireBaseService : IFireBaseService
    {
        private readonly IGenericRepository<Configuracion> _repositorio;

        public FireBaseService(IGenericRepository<Configuracion> repositorio)
        {
            _repositorio=repositorio;
        }
        public async Task<string> SubirStorage(Stream StreamArchivo, Stream CarpetaDestino, Stream NombreArchivo)
        {
            string UrlImagen = "";

            try
            {
                IQueryable<Configuracion> query = await _repositorio.Consultar(c => c.Recurso.Equals("FireBase_Storage"));
                Dictionary<string, string> Config = query.ToDictionary(keySelector: c => c.Propiedad, elementSelector: c => c.Valor);

                FirebaseAuthProvider firebaseAuthProvider = new Firebase.Auth.Providers();
                var auth = firebaseAuthProvider;

                var a = await auth.Sign

            }
            catch { };
        }

        public Task<string> EliminarStorage(Stream CarpetaDestino, Stream NombreArchivo)
        {
            throw new NotImplementedException();
        }

        
    }
}
