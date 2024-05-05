using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(dest => dest.ProductBrand, source => source.MapFrom(sourceProp => sourceProp.ProductBrand.Name))
                .ForMember(dest => dest.ProductType, source => source.MapFrom(sourceProp => sourceProp.ProductType.Name))
                .ForMember(dest => dest.PictureUrl, source => source.MapFrom<ProductUrlResolver>());

            CreateMap<Core.Entities.Identity.Address, AddressDto>().ReverseMap();
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(dest => dest.DeliveryMethod, source => source.MapFrom(sourceProp => sourceProp.DeliveryMethod.ShortName))
                .ForMember(dest => dest.ShippingPrice, source => source.MapFrom(sourceProp => sourceProp.DeliveryMethod.Price));
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductId, source => source.MapFrom(sourceProp => sourceProp.ItemOrdered.ProductItemId))
                .ForMember(dest => dest.ProductName, source => source.MapFrom(sourceProp => sourceProp.ItemOrdered.ProductName))
                .ForMember(dest => dest.PictureUrl, source => source.MapFrom(sourceProp => sourceProp.ItemOrdered.PictureUrl))
                .ForMember(dest => dest.PictureUrl, source => source.MapFrom<OrderItemUrlResolver>());
        }
    }
}