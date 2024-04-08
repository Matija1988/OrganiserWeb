using AutoMapper;
using PO.Models;
using System.Drawing.Text;

namespace PO.Mappers
{
    public class ProofMapper : Mapping<ProofOfDelivery, ProofDTORead, ProofDTOInsertUpdate>
    {
        public ProofMapper()
        {
                MapperReadToDTO = new Mapper(
                    new MapperConfiguration(
                    c =>
                    {
                        c.CreateMap<ProofOfDelivery, ProofDTORead>()
                        .ConstructUsing(entity =>
                        new ProofDTORead(
                            entity.ID,
                            entity.DocumentName == null ? "" : entity.DocumentName,
                            entity.Member == null ? "" : (entity.Member.FirstName + " " + entity.Member.LastName).Trim(),
                            FilePath(entity),
                            entity.DateCreated == null ? null : entity.DateCreated,
                            entity.Activity == null ? null : entity.Activity.ActivityName
                            )
                        );
                    })
                    );

            MapperMapInsertUpdatedFromDTO = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<ProofDTOInsertUpdate, ProofOfDelivery>();
                }));
            
               MapperMapInsertUpdateToDTO = new Mapper(
                   new MapperConfiguration(
                       c =>
                       {
                           c.CreateMap<ProofOfDelivery, ProofDTOInsertUpdate>()
                           .ConstructUsing(entity =>
                           new ProofDTOInsertUpdate(
                               entity.DocumentName,
                               entity.Member == null ? null : entity.Member.ID,
                               FilePath(entity),
                               entity.DateCreated == null ? null : entity.DateCreated,
                               entity.Activity.ID
                               )) ;
                       }
                       ));
            
        }   

        private static string FilePath(ProofOfDelivery p)
        {
            try
            {
                var ds = Path.DirectorySeparatorChar;

                string dir = Path.Combine(Directory.GetCurrentDirectory() + ds + "wwwroot"
                    + ds + "file" + ds + "proofs" + ds);
                DirectoryInfo d = new DirectoryInfo(dir);
                FileInfo[] Files = d.GetFiles(p.ID + "_*");
                return Files != null && Files.Length > 0 ? "/file/proofs/" + Files[0].Name : null;
            
            } catch
            {
                return null;
            }
                

        }     
    }
}
