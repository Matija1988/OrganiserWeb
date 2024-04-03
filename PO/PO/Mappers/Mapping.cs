using AutoMapper;

namespace PO.Mappers
{
    public class Mapping<T,DTR,DTI>
    {
        protected Mapper MapperReadToDTO;
        protected Mapper MapperMapInsertUpdatedFromDTO;
        protected Mapper MapperMapInsertUpdateToDTO;


        public Mapping()

        { 
            
                MapperReadToDTO = new Mapper(
                    new MapperConfiguration(c =>
                    {
                        c.AllowNullDestinationValues = true;
                        c.CreateMap<T, DTR>();
                    }));
            

            /// <summary>
            /// 
            /// </summary>
            /// <param name="entity"></param>
            /// <returns></returns>
                MapperMapInsertUpdatedFromDTO = new Mapper(
                    new MapperConfiguration(c =>
                    {
                        c.CreateMap<DTI, T>();
                    }));
            
                MapperMapInsertUpdateToDTO = new Mapper(
                    new MapperConfiguration(c =>
                    {
                        c.CreateMap<T, DTI>();
                    }));
             
            
        }

        public List<DTR> MapReadList(List<T> list)
        {
            var returnResult = new List<DTR>();
            list.ForEach(e =>
            {
                returnResult.Add(MapReadToDTO(e));
            });
            return returnResult;
        }

        public DTR MapReadToDTO(T entity)
        {
            return MapperReadToDTO.Map<DTR>(entity);
        }

        public T MapInsertUpdatedFromDTO(DTI entity)
        {
            return MapperMapInsertUpdatedFromDTO.Map<T>(entity);
        }

        public DTI MapInsertUpdateToDTO(T entity)
        {
            return MapperMapInsertUpdateToDTO.Map<DTI>(entity);
        }
    }
}

