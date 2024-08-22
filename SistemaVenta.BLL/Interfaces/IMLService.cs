using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.Entity;

namespace SistemaVenta.BLL.Interfaces
{
    public interface IMLService
    {
        Task<List<Categoria>> Lista();
        Task<Categoria>Crear(Categoria categoria);
        Task<Categoria>Editar(Categoria categoria);
        Task<bool>Eliminar(int idCategoria);
    }
}
