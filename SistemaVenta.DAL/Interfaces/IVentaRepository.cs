using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.Entity;

namespace SistemaVenta.DAL.Interfaces
{
    public interface IVentaRepository: IGenericRepository<Venta>
    {
        // Registrar una venta
        Task<Venta> Registrar(Venta entidad);
        // Lista de ventas en un filtrado por fecha de inicio y fecha de fin.
        Task<List<DetalleVenta>> Reporte(DateTime FechaInicio, DateTime FechaFin); 
    }
}
