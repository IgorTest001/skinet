using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IMapper _mapper;
        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            _mapper = mapper;
            _basketRepository = basketRepository;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketIdAsync(string id)
        {
            var basket = await _basketRepository.GetBasketAsync(id);
            return Ok(basket ?? new CustomerBasket(id)); // This "basket" could be NULL, and if it is, 
                                                         // then what we'll do is we'll return a new customer basket 
                                                         // and we'll use the ID that the client has generated 
                                                         // to give them back a new basket with an empty list of items 
                                                         // and will create an HTTP-Post.
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasketAsync(CustomerBasketDto customerBasketDto)
        {
            var customerBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(customerBasketDto);

            var updatedBasket = await _basketRepository.UpdateBasketAsync(customerBasket);
            return Ok(updatedBasket);
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id)
        {
            await _basketRepository.DeleteBasketAsync(id);
        }
    }
}