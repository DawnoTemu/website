tailwind.config = {
    theme: {
      extend: {
        colors: {
          peach: 'rgb(251, 190, 159)',
          'peach-dark': '#FF9A8A',
          lavender: 'rgb(218, 143, 255)',
          'lavender-dark': '#B8A2DC',
          mint: 'rgb(99, 230, 226)',
          'soft-yellow': 'rgb(250, 232, 176)',
          'text-dark': '#2D3047',
          'text-medium': '#6C6F93',
          'text-light': '#9CA3AF',
          'bg-light': '#F9FAFC',
        },
        fontFamily: {
          'comfortaa': ['Comfortaa', 'cursive'],
          'sans': ['Quicksand', 'sans-serif'],
        },
        boxShadow: {
          'sm-custom': '0 4px 6px rgba(45, 48, 71, 0.05)',
          'md-custom': '0 10px 20px rgba(45, 48, 71, 0.08)',
          'lg-custom': '0 20px 25px -5px rgba(45, 48, 71, 0.1)',
        },
        borderRadius: {
          'sm-custom': '8px',
          'md-custom': '16px',
          'lg-custom': '24px',
        },
        screens: {
          'xs': '480px',
        },
      }
    }
  }