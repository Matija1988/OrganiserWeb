using AutoMapper;

namespace PO.Mappers
{
    public class Mapping<T,DTR,DTI>
    {
        public List<DTR> MapReadList(List<T> list)
        {
            var mapper = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.AllowNullDestinationValues = true;
                    c.CreateMap<T,DTR>();
                }));
            var returnList = new List<DTR>();
            list.ForEach(x => { 
                
                returnList.Add(mapper.Map<DTR>(x));
            });
            return returnList;
        }

        public DTR MapReadToDTO(T entity)
        {
            var mapper = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.AllowNullDestinationValues = true;
                    c.CreateMap<T, DTR>();
                }));
            return mapper.Map<DTR>(entity);
        }
        public T MapInsertUpdateFromDTO(DTI entity)
        {
            var mapper = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<DTI, T>();
                }));
            return mapper.Map<T>(entity);
        }
    }
}
