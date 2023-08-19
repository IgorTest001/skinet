using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using AutoMapper;
using API.Errors;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _products;
        private readonly IGenericRepository<ProductBrand> _productBrands;
        private readonly IGenericRepository<ProductType> _productTypes;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> products, 
                                  IGenericRepository<ProductBrand> productBrands, 
                                  IGenericRepository<ProductType> productTypes,
                                  IMapper mapper)
        {
            _productTypes = productTypes;
            _mapper = mapper;
            _productBrands = productBrands;
            _products = products;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts([FromQuery]ProductSpecParams productSpecParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productSpecParams);
            var countSpec = new ProductWithFiltersForCountSpecification(productSpecParams);

            var products = await _products.ListAsync(spec);
            var totalCount = await _products.ListAsync(countSpec);
            
            if (products == null)   
                return NotFound(new ApiResponse(404)); 

            return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
        } 

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            var productBrands = await _productBrands.ListAllAsync();

            return Ok(productBrands);
        } 

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            var productTypes = await _productTypes.ListAllAsync();

            return Ok(productTypes);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            var product = await _products.GetEntityWithSpec(spec);
            if (product == null)   
                return NotFound(new ApiResponse(404));

            return _mapper.Map<Product, ProductToReturnDto>(product);
        }
    }
}