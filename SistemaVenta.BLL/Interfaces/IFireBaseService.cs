using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.BLL.Interfaces
{
    public interface IFireBaseService
    {
        Task<string> SubirStorage(Stream StreamArchivo, Stream CarpetaDestino, Stream NombreArchivo);
        Task<string> EliminarStorage(Stream CarpetaDestino, Stream NombreArchivo);
    }
}
