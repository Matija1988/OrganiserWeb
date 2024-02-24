using System.ComponentModel.DataAnnotations;

namespace PO.Models
{
    /// <summary>
    /// Ovo je vrsna nad klasa koja sluzi za osnovne atribute tipa sifra, operater, datum unosa ...
    /// This is a class that provides basic atrubutes like ID, operators, dates of entry ....
    /// </summary>
    public abstract class Entity
    {
        /// <summary>
        /// Ovo svojstvo sluzi kao primarni kljuc u DB s generiranjem vrijednosti identiteti(1,1)
        /// This property serves as PK in a DB with auto generated values identity(1,1)
        /// </summary>

        [Key]
        public int ID { get; set; }
    }
}
